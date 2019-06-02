const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route  GET api/profile/me
// @desc   retrieve user's profile based on user id based on token
// @access private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  Post api/profile
// @desc   create or update a  user's profile.
// @access private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required')
        .not()
        .isEmpty(),
      check('skills', 'skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = company;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};

    if (youtube || youtube === '') {
      profileFields.social.youtube = youtube;
    }
    if (facebook || facebook === '') {
      profileFields.social.facebook = facebook;
    }
    if (twitter || twitter === '') {
      profileFields.social.twitter = twitter;
    }
    if (instagram || instagram === '') {
      profileFields.social.instagram = instagram;
    }
    if (linkedin || linkedin === '') {
      profileFields.social.linkedin = linkedin;
    }

    try {
      console.log('made it to update/create profile location');
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          {
            new: true
          }
        );
        return res.json(profile);
      }
      // user doesnt have a profile, so create one
      profile = new Profile(profileFields);
      await profile.save();
      console.log('new profile successfully saved');
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  get api/profile
// @desc   get all profiles
// @access public
router.get('/', async (req, res) => {
  try {
    // get profiles via mongoose interface
    const profiles = await Profile.find({}).populate('user', [
      'name',
      'avatar'
    ]);

    if (profiles) return res.status(200).json(profiles);

    return res.status(200).json({});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  get api/profile/user/:user_id
// @desc   get profile by user id
// @access public
router.get('/user/:user_id', async (req, res) => {
  try {
    // get profiles via mongoose interface
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'profile not found' });

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'profile not found' });
    res.status(500).send('server error');
  }
});

// @route  Delete api/profile
// @desc   delete profile, user, and posts
// @access private

router.delete('/', auth, async (req, res) => {
  try {
    // delete user, profile, posts
    console.log(req.user.id);
    const user = await User.findById(req.user.id);
    console.log(user);

    if (user) {
      const profile = await Profile.findOne({ user: req.user.id });
      const post = await Post.findOne({ user: req.user.id });
      if (post) {
        console.log('trying to delete posts');
        await Post.deleteMany({ user: req.user.id });
        console.log('posts deleted');
      }
      if (profile) {
        console.log('trying to delete profile');
        await Profile.deleteOne({ user: req.user.id });
        console.log('profile deleted');
      }
      console.log('trying to delete user');

      await User.deleteOne({ _id: req.user.id });
      console.log('user deleted');
      return res.json({ msg: 'user deleted' });
    }

    res.status(400).send('invalid user credentials');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required')
        .not()
        .isEmpty(),
      check('company', 'company is required')
        .not()
        .isEmpty(),
      check('from', 'from date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  Delete api/profile/experience/:experience_id
// @desc   delete profile experience
// @access private

router.delete('/experience/:experience_id', auth, async (req, res) => {
  try {
    // check to see if profile and experience exist
    const profile = await Profile.findOne({ user: req.user.id });

    const experience = await profile.experience.id(req.params.experience_id);

    if (!profile || !experience)
      return res.status(400).json({ msg: 'invalid info' });
    // delete the experience
    await Profile.updateOne(
      { user: req.user.id },
      { $pull: { experience: { _id: req.params.experience_id } } }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  PUT api/profile/education
// @desc   Add education experience
// @access private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is a required')
        .not()
        .isEmpty(),
      check('degree', 'degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'fieldofstudy is required')
        .not()
        .isEmpty(),
      check('from', 'from date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: 'invalid data' });

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(400).json({ msg: 'invalid data' });

      const {
        school,
        degree,
        fieldofstudy,
        from,
        current,
        to,
        description
      } = req.body;
      const educationExperience = {
        school,
        degree,
        fieldofstudy,
        from,
        current,
        to,
        description
      };

      profile.education.unshift(educationExperience);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.messsage);
      res.status(500).send('server error');
    }
  }
);

// @route  Delete api/profile/education/:education_id
// @desc   delete education item
// @access private

router.delete('/education/:education_id', auth, async (req, res) => {
  try {
    // check to see if profile and education exist
    const profile = await Profile.findOne({ user: req.user.id });

    const education = await profile.education.id(req.params.education_id);

    if (!profile || !education)
      return res.status(400).json({ msg: 'invalid info' });
    // delete the education item
    await Profile.updateOne(
      { user: req.user.id },
      { $pull: { education: { _id: req.params.education_id } } }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  GET api/profile/github/:username
// @desc   GET github repos for :username
// @access Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js'
      }
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);

      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'no github profile found' });

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
