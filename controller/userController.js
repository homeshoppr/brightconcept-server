import { google } from "googleapis";
import { User } from "../models/userSchema.js";
import twilio from 'twilio';

// twilio config
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

// google auth config
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const origins = process.env.FRONTEND_URL;

export const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  origins
);

// generate access token and refresh token
const generateTokens = async (userId, res) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return null;
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          new ApiResponse(
            500,
            null,
            "Something went wrong while generating tokens"
          )
        );
      return null;
    }
  };

// login user
const login = async (req, res) => {
    try {
        // get data from req.body
    const { email, password } = req.body;
  
    // validate data
    if (!email || !password) {
      return res
        .status(400)
        .json({message: "Please provide all required fields."});
    }
  
    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({message: "Invalid credentials."});
    }
  
    // check password
    if (!(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({message: "Invalid credentials."});
    }
  
    // generate tokens
    const tokens = await generateTokens(user._id, res);
    const { accessToken, refreshToken } = tokens;
  
    const updatedUser = await User.findById(user._id).select(
      "-password -__v"
    );
  
    // send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 10 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({user: updatedUser, message: "Login successful."});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong with login."});
    }
}

// logout user
const logout = async (req, res) => {
    try {
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({message: "Logout successful."});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong with logout."});
    }
  };

// user details
const userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select(
            "-password -__v"
        );
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }
        return res
            .status(200)
            .json({user, message: "User found successfully."});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong with user details."});
    }
}

// google auth
const googleAuth = async (req, res) => {
    try {
      const { token } = req.body;
  
      if (!token || typeof token !== "string") {
        return res
          .status(400)
          .json(
           {message: "Token is required and must be a string"}
          );
      }
  
      const googleRes = await oAuth2Client.getToken(token);
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: googleRes.tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      const { email, name } = payload;
  
      if (!email || !name) {
        return res
          .status(404)
          .json({message: "Email or name are not found"});
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        const user = await User.create({
          email,
          name,
          password: Math.random().toString(36).slice(-8),
        });
        // generate tokens
        const tokens = await generateTokens(user._id, res);
        if (!tokens) {
          return; // Exit if tokens generation failed
        }
        const { accessToken, refreshToken } = tokens;
  
        const loggedInUser = await User.findById(user._id).select(
          "-password -__v"
        );
  
        // send response
        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000,
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          })
          .json(
            {user: loggedInUser, message: "Sign up successful with google"}
          );
      } else {
        // generate tokens
        const tokens = await generateTokens(user._id, res);
        if (!tokens) {
          return; // Exit if tokens generation failed
        }
        const { accessToken, refreshToken } = tokens;
        const loggedInUser = await User.findById(user._id).select(
          "-password  -__v"
        );
  
        // send response
        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000,
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          })
          .json(
            {user: loggedInUser, message: "Login successful with google"}
          );
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({message: "Something went wrong with google"});
    }
  }

// update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const { name, email, phoneNumber } = req.body;
        
        let hasUpdated = false;
        if (name) {
            user.name = name;
            hasUpdated = true;
        }
        if (email) {
          if (await User.findOne({ email })) {
            return res
              .status(400)
              .json({message: "Email already exists."});
          }
            user.email = email;
            hasUpdated = true;
        }
        if (phoneNumber) {
            if (await User.findOne({ phoneNumber })) {
                return res
                  .status(400)
                  .json({message: "Phone number already exists."});
            }
            user.phoneNumber = phoneNumber;
            hasUpdated = true;
        }
        if (!hasUpdated) {
            return res
                .status(400)
                .json({message: "Please provide at least one field to update"});
        }
        await user.save();
        return res
            .status(200)
            .json({user, message: "User updated successfully."});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({message: "Something went wrong with user update."});
    }
}

// send otp
const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Failed to send OTP' });
  }
}

// verify otp
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: otpCode });
      if (verificationCheck.status === 'approved') {
        // check if user exists
        const user = await User.findOne({ phoneNumber });
        if (!user) {
          return res
            .status(200)
            .json({ message: 'Phone number verified successfully. Now add your details' });
        }

        // generate tokens
        const tokens = await generateTokens(user._id, res);
        const { accessToken, refreshToken } = tokens;
      
        const updatedUser = await User.findById(user._id).select(
          "-password -__v"
        );
      
        // send response
        return res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000,
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          })
          .json({user: updatedUser, message: "Login successful."});
      } else {
        res.status(400).send('Invalid OTP.');
      }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Failed to verify OTP' });
  }
}

// add details after otp verification if user not exists
const addDetails = async (req, res) => {
  try {
    const { phoneNumber, name, email } = req.body;
    if (!phoneNumber || !name || !email) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: 'Email already exists' });
    }
    // create user
    const user = await User.create({
      phoneNumber,
      name,
      email,
      password: Math.random().toString(36).slice(-8),
    });
    if (!user) {
      return res
        .status(500)
        .json({ message: 'Failed to add user details' });
    }
    // generate tokens
    const tokens = await generateTokens(user._id, res);
    const { accessToken, refreshToken } = tokens;
  
    const updatedUser = await User.findById(user._id).select(
      "-password -__v"
    );
  
    // send response
    return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 10 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({user: updatedUser, message: "Login successful."});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Failed to add user details' });
  }
}

export { login, logout, userDetails, googleAuth, updateUser, sendOTP, verifyOTP, addDetails };