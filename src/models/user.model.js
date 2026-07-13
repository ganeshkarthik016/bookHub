import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userFullName: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },

        profilePic: {
            type: String,
            default: ".../public/defaultProfilePic.png",
        },

        watchHistory: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Note",
                },
            ],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();


})

export const User = mongoose.model("User", userSchema);