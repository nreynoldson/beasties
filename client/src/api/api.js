import request from 'superagent';
const {
  REACT_APP_API_KEY,
  REACT_APP_BACKEND_URL_PREFIX
} = process.env;

const makeBackendUrl =
  (suffix) => `https://${REACT_APP_API_KEY}.${REACT_APP_BACKEND_URL_PREFIX}${suffix}`;

const handleRequest = async (req) => {

  const response = { 
    result: null,
    error: null
   };

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

    edit: async (id, petParams) => {

      const req = request
        .patch(makeBackendUrl(`/animal${id}`))
        .send(petParams);

      return await handleRequest(req);
    },

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/animal${id}`));

      return await handleRequest(req);
    },

    search: async (searchParams) => {

      const req = request
        .get(makeBackendUrl(`/animal/search`))
        .query(searchParams);

      return await handleRequest(req);
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
    }
  },

  User: {

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
    }
  }
};

export default api;
