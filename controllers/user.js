const User = require('../models/user.js')

module.exports.getSignupForm = (req, res, next) => {
    res.render('user/signup.ejs')
}
module.exports.getLoginForm = (req, res) => {
    res.render('user/login.ejs')
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        pw = password
        const newUser = new User({ email, pw, username })
        newUser.profile.profileImage = {
            url: "https://res.cloudinary.com/duwrgtvqv/image/upload/v1719633471/default_picture.png",
            filename: "default_profile_picture"
        }
        const regUser = await User.register(newUser, password)
        req.login(regUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", `@${username}, Welcome to Campus Diaries, KKWIEER`)
            res.redirect('/users/setup-profile')
        })
    } catch (err) {
        req.flash("error", err.message)
        res.redirect('/users/signup')
    }
}

module.exports.login = async (req, res) => {
    req.flash("success", `@${req.body.username}, Welcome back to Campus Diaries, KKWIEER!!`)
    url = res.locals.redirectUrl ? res.locals.redirectUrl : '/explore'
    res.redirect(url)
}

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You have been logged out successfully")
        return res.redirect('/explore')
    })
}

// profile setting up
module.exports.getProfileSetupForm = (req, res) => {
    res.render('user/setupProfile.ejs');
}

module.exports.setupProfile = async (req, res) => {
    const url = req.file.path
    const filename = req.file.filename

    console.table([url, filename])

    const { bio } = req.body;
    const profileImage = { url, filename };

    const user = await User.findById(req.user._id);

    user.profile = { bio, profileImage }
    await user.save();

    console.log(user)

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/explore');
}
