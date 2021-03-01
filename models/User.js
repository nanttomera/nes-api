const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    openId: {
      type: String,
      require: true,
      unique: true,
    },
    profile: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);
//hashpass
// UserSchema.pre("save",async function (next) {
//     if (this.isNew) {
//       const User = model("User");
//       this.password = await User.hashPassword(this.password);
//     }
//     next();
// })

UserSchema.statics.hashPassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(plainPassword, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

UserSchema.methods.checkPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = model("User", UserSchema);
