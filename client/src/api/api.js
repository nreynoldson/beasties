import request from 'superagent';
import {getUser} from '../components/account/Account'
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

    delete: async (id) => {

      const req = request
        .delete(makeBackendUrl(`/animal/${id}`));

      return await handleRequest(req);
    },

    deleteImage: async (id) => {

      const req = request
        .post(makeBackendUrl(`/animal/delete-image`))
        .send({ id });

      return await handleRequest(req);
    },

    edit: async (id, petParams) => {

      const req = request
        .patch(makeBackendUrl(`/animal/${id}`))
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
        .get(makeBackendUrl(`/animals/${petName}/${shelterName}`));

      return await handleRequest(req);
    },

    search: async (searchParams) => {

      const req = request
        .get(makeBackendUrl(`/animal/search`))
        .query(searchParams);

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


    delete: async (id) => {

      const req = request
        .delete(makeBackendUrl(`/shelter/${id}`));

      return await handleRequest(req);
    },

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

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/shelter${id}`));

      return await handleRequest(req);
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
      console.log('in shelter get')
      console.log(makeBackendUrl(`/requestsForShelterOwner/${shelterName}`))
      const req = request
        .get(makeBackendUrl(`/requestsForShelterOwner/${shelterName}`));

      return await handleRequest(req);
  }
  },

  User: {

    delete: async (userName) => {

      const req = request
        .delete(makeBackendUrl(`/user/${userName}`));

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

    getInfo: async (userName) => {

      const req = request
        .get(makeBackendUrl(`/user/${userName}`));

      return await handleRequest(req);
    },

    search: async (searchParams) => {

      const req = request
        .get(makeBackendUrl(`/user/search`))
        .query(searchParams);

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
      console.log('in user requests');
        const req = request
          .get(makeBackendUrl(`/request/${username}`));
  
        return await handleRequest(req);
    }
  }
};

export default api;
