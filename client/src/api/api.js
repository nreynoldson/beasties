import request from 'superagent';
import { trackPromise } from 'react-promise-tracker';

const {
  REACT_APP_API_KEY,
  REACT_APP_BACKEND_URL_PREFIX
} = process.env;

const makeBackendUrl =
  (suffix) => `https://${REACT_APP_API_KEY}.${REACT_APP_BACKEND_URL_PREFIX}${suffix}`;

const handleRequest = async (req, options = {}) => {

  // Set options to default if they are not specified
  options = {
    requestTypeIsJson: true,
    ...options
  };

  const response = { 
    result: null,
    error: null
   };

   if (options.requestTypeIsJson) {
    req.type('json');
   }

   try {
    const result = await trackPromise(req);
    response.result = result.body?.items;

   }
   catch (e) {
    response.error = e;
   }

   return response;
};

const api = {

  Animal: {

    create: async (petParams) => {
      const req = request
        .post(makeBackendUrl(`/animal`))
        .send(JSON.stringify(petParams));

      return await handleRequest(req);
    },

    delete: async (name, shelterName, shelterOwnerName) => {

      const req = request
        .delete(makeBackendUrl(`/animalDelete/${name}/${shelterName}/${shelterOwnerName}`));

      return await handleRequest(req);
    },

    deleteImage: async (id) => {

      const req = request
        .post(makeBackendUrl(`/animal/delete-image`))
        .send({ id });

      return await handleRequest(req);
    },

    edit: async (animalName, shelterName, petParams) => {

      const req = request
        .patch(makeBackendUrl(`/animalEdit/${animalName}/${shelterName}`))
        .send(petParams);

      return await handleRequest(req);
    },

    getImages: async (id) => {

      const req = request
        .get(makeBackendUrl(`/animal/${id}/images`));

      return await handleRequest(req);
    },

    getInfo: async (petName, shelterName) => {

      const req = request
        .get(makeBackendUrl(`/animal/${petName}/${shelterName}`));

      return await handleRequest(req);
    },

    getAnimalsByShelter: async (shelterName) => {

      const req = request
        .get(makeBackendUrl(`/animalsGet/${shelterName}`));

      return await handleRequest(req);
    },

    search: async () => {

      const req = request
        .get(makeBackendUrl(`/animalsGet`));

      return await handleRequest(req);
    },

    setAvatar: async (id) => {

      const req = request
        .patch(makeBackendUrl(`/animal/set-avatar-image`))
        .send({ id });

      return await handleRequest(req);
    },

    uploadImage: async (petId, imageFile) => {

      const req = request
        .post(makeBackendUrl(`/animal/upload-image`));

        req.field('petId', petId);
        req.attach('image', imageFile);

      return await handleRequest(req, { requestTypeIsJson: false });
    },

    makeRequest: async (requestParams) => {
      const req = request
        .post(makeBackendUrl(`/request`))
        .send(JSON.stringify(requestParams));

      return await handleRequest(req);
    }
  },

  Dummy: {

    returnThisData: async (data, delay = 100) => {

      const sleep = (ms) => new Promise(r => setTimeout(r, ms));

      return await trackPromise((async () => {

        await sleep(delay);

        return {
          error: null,
          result: data
        };
      })());
    }
  },

  Shelter: {

    deleteImage: async (id) => {

      const req = request
        .post(makeBackendUrl(`/shelter/delete-image`))
        .send({ id });

      return await handleRequest(req);
    },

    getImages: async (id) => {

      const req = request
        .get(makeBackendUrl(`/shelter/${id}/images`));

      return await handleRequest(req);
    },

    getAllShelters: async () => { 
      const req = request
      .get(makeBackendUrl(`/users/shelterUsers`));

      return await handleRequest(req);
    },

    ///Temporary bandaid since I'm not sure we have a way to getshelters by shelterName 
    // at present moment - definitely not scalable lol :) 
    getInfo: async (shelterName) => { 
      const req = request
      .get(makeBackendUrl(`/users/shelterUsers`));

      var response = await handleRequest(req);
      if(response.error){
        return response;
      } else{
        for(var shelter of response.result){
          if(shelter.shelterName == shelterName){
            return response.result = shelter;
          }
        }

        delete response.result;
        response.error = "No such shelter with that name";
        return response;
      }
    },

    search: async (searchParams) => {

      const req = request
        .get(makeBackendUrl(`/shelter/search`))
        .query(searchParams);

      return await handleRequest(req);
    },

    setAvatar: async (id) => {

      const req = request
        .patch(makeBackendUrl(`/shelter/set-avatar-image`))
        .send({ id });

      return await handleRequest(req);
    },

    uploadImage: async (shelterId, imageFile) => {

      const req = request
        .post(makeBackendUrl(`/shelter/upload-image`));

        req.field('shelterId', shelterId);
        req.attach('image', imageFile);

      return await handleRequest(req, { requestTypeIsJson: false });
    },
    getRequests: async (shelterName) => {
      const req = request
        .get(makeBackendUrl(`/requestsForShelterOwner/${shelterName}`));

      return await handleRequest(req);
    },
    updateRequest: async (shelterOwner, username, shelterName, animalName, editParams) => {

      const req = request
        .patch(makeBackendUrl(`/requestEditByShelter/${shelterOwner}/${username}/${shelterName}/${animalName}/`))
        .send(JSON.stringify(editParams));
      
      return await handleRequest(req);
    },
  },

  User: {

    delete: async (userName) => {

      const req = request
        .delete(makeBackendUrl(`/userDelete/${userName}`));

      return await handleRequest(req);
    },

    deleteImage: async (id) => {

      const req = request
        .post(makeBackendUrl(`/user/delete-image`))
        .send({ id });

      return await handleRequest(req);
    },

    getImages: async (userName) => {

      const req = request
        .get(makeBackendUrl(`/user/${userName}/images`));

      return await handleRequest(req);
    },

    getInfo: async () => {
      const response = { 
        result: null,
        error: null
       };

      try {
        var attributes = await trackPromise(getUser());
        if(attributes){ 
          const req = request
          .get(makeBackendUrl(`/user/${attributes.username}`));
          var result = await handleRequest(req);
          var userInfo = result.result;
          userInfo.isAdmin = attributes.admin;
          response.result = userInfo;
        }
        else{
          response.result = null;
        }
        return response;
      }
      catch (e) {
        response.error = e;
        return response;
      }
    },

    getAllUsers: async () => { 
      const req = request
      .get(makeBackendUrl(`/users/regularUsers`));

      return await handleRequest(req);
    },

    updateUser: async (username, updateParams) => {

      const req = request
        .patch(makeBackendUrl(`/userEdit/${username}`))
        .send(JSON.stringify(updateParams));

      return await handleRequest(req);
    },

    search: async (userType) => {

      const req = request
        .get(makeBackendUrl(`/users/${userType}`));

      return await handleRequest(req);
    },

    setAvatar: async (imageId) => {

      const req = request
        .patch(makeBackendUrl(`/user/set-avatar-image`))
        .send({ imageId });

      return await handleRequest(req);
    },
    uploadImage: async (userId, imageFile) => {

      const req = request
        .post(makeBackendUrl(`/user/upload-image`));

        req.field('userId', userId);
        req.attach('image', imageFile);

      return await handleRequest(req, { requestTypeIsJson: false });
    },

    getRequests: async (username) => {
        const req = request
          .get(makeBackendUrl(`/request/${username}`));
  
        return await handleRequest(req);
    },

    create: async(params) => {
      const req = request
        .post(makeBackendUrl(`/user`))
        .send(JSON.stringify(params));

      return await handleRequest(req);
    },

    deleteRequest: async (username, shelterName, animalName) => {
      const req = request
        .delete(makeBackendUrl(`/requestDelete/${username}/${shelterName}/${animalName}`));

      return await handleRequest(req);
  }
  }
};

export default api;