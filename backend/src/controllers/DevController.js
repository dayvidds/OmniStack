const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username});

        if(!dev){

            
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
            
            const { name = login, avatar_url, bio } = apiResponse.data;
            
            console.log(name, avatar_url, bio, github_username, techs, latitude, latitude);
            
            const techsArray = parseStringAsArray(techs);
            
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
            
            dev = await Dev.create({
		name,
                github_username,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }
        return response.json(dev);
        },

        async index(request, response){
            const devs = await Dev.find();

            return response.json(devs);
        },

        async destroy(request, response){
            const {id} = request.query;

            const devs = await Dev.deleteOne({
                _id: {
                    $in: id,
                },
            });
            return response.json({});
        }
        
}
