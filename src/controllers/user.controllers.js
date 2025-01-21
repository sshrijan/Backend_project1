import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiErrors(500,"something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user data from frontend
    // validation - not empty
    // check if user already exists: email,username
    // check for image,check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    

const {fullName, username, email, password, } = req.body
   // console.log(fullname)
    
    if (fullName === "") {
    throw ApiErrors(400,"fullname is required")
    }
    if (username === "") {
    throw ApiErrors(400,"username is required")
    }
    if (email === "") {
    throw ApiErrors(400,"email is required")
    }
    if (password === "") {
    throw ApiErrors(400,"password is required")
    }


const existedUser = await User.findOne({
    $or: [{ username },{ email }]
})
    if (existedUser) {
    throw new ApiErrors(409,"User with Username or Email is already exists")       
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && 
    req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiErrors(400,"Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiErrors(400,"Avatar is required")
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiErrors(500, "User could not be created")
    }

    return res.status(201).json(
    new ApiResponse(200,createdUser,"User has been registered successfully")
    )
})

const loginUser = asyncHandler(async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // genereate access and refresh token
    // send cookie

    const {username, email, password} = req.body

    if (!username || email) {
        throw new ApiErrors(400,"username or email is required") 
    }
   const user = await User.findOne({
        $or : [{username},{email}]
    })

    if (!user) {
        throw new ApiErrors(400,"User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiErrors(401,"Password Incorrect")
    }

    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedInUser = user.findById(_id)
    .select("-password","-refreshToken")

    const option{
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(200,
            {
            user : loggedInUser
            },
        "User logged in sucessfully")
    )
})



    export {
        registerUser,
        loginUser
    }