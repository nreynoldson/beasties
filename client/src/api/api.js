import request from 'superagent';
const {
  REACT_APP_API_KEY,
  REACT_APP_BACKEND_URL_PREFIX
} = process.env;

const makeBackendUrl =
  (suffix) => `https://${REACT_APP_API_KEY}.${REACT_APP_BACKEND_URL_PREFIX}${suffix}`;

const handleRequest = async (req, options = {}) => {

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
    response.result = await req;
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
        .send(petParams);

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

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/animal/${id}`));

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
    }
  },

  Dummy: {

    returnThisData: async (data) => {

      return {
        error: null,
        result: data
      };
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
    }
  },

  User: {

    deleteImage: async (id) => {

      const req = request
        .post(makeBackendUrl(`/user/delete-image`))
        .send({ id });

      return await handleRequest(req);
    },

    getImages: async (id) => {

      const req = request
        .get(makeBackendUrl(`/user/${id}/images`));

      return await handleRequest(req);
    },

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/user${id}`));

      return await handleRequest(req);
    },

    search: async (searchParams) => {

      const req = request
        .get(makeBackendUrl(`/user/search`))
        .query(searchParams);

      return await handleRequest(req);
    },

    setAvatar: async (id) => {

      const req = request
        .patch(makeBackendUrl(`/user/set-avatar-image`))
        .send({ id });

      return await handleRequest(req);
    },

    uploadImage: async (userId, imageFile) => {

      const req = request
        .post(makeBackendUrl(`/user/upload-image`));

        req.field('userId', userId);
        req.attach('image', imageFile);

      return await handleRequest(req, { requestTypeIsJson: false });
    }
  }
};

export default api;
