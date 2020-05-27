/**
 * Photo Controller
 */

const models = require('../models');

// Show index of all photos
// GET /photos
const index = async (req, res) => {
	const userId = req.user.data.id;

	let photos = null;
	try {
		photos = await models.Photo.where('user_id', userId).fetchAll();
	} catch (error) {
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
		status: 'success',
		data: {
			photos,
		}
	});
};

// Show specific photo
// GET /photos/:photoId
const show = async (req, res) => {
	const userId = req.user.data.id;

	let photo = null;
	try {
		photo = await new models.Photo({ id: req.params.photoId }).where('user_id', userId).fetch({ withRelated: 'albums' });
	} catch (error) {
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
		status: 'success',
		data: {
			photo,
		}
	});
};

// Store new photo
// POST /photos
const store = async (req, res) => {
	const userId = req.user.data.id;

	const newPhoto = {
		title: req.body.title,
		url: req.body.url,
		comment: req.body.comment,
		user_id: userId
	}

	try {
		const photo = await models.Photo.forge(newPhoto).save();
		console.log('Successfully created new photo: ', photo);

		res.send({
			status: 'success',
			data: {newPhoto}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Sorry, something went wrong while trying to store new photo.'
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
}