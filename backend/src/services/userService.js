const { ObjectId } = require('mongodb');
const mongo = require('./mongoService');

const collection = () => mongo.connection.collection('users');

async function getMany() {
    return await collection().find({ 'isDeleted': false }, { projection: { isDeleted: 0 } }).toArray();
}

async function getSingle(id) {
    return await collection().findOne({ '_id': new ObjectId(id), 'isDeleted': false }, { projection: { isDeleted: 0 } });
}

async function create(user) {
	const existingUser = await getUserByEmail(user.email);
	if (existingUser == null) {
		user.isDeleted = false;
		return await collection().insertOne(user);
	}
	return null;
}

async function getUserByEmail(email) {
    return await collection().findOne({ 'email': email, 'isDeleted': false });
}


async function remove(id) {
    // Updates the boolean isDeleted to true
    return await collection().updateOne({ '_id': new ObjectId(id) }, { $set: { isDeleted: true } });
}

module.exports = {
    getMany,
    getSingle,
    create,
    getUserByEmail,
    remove
}
