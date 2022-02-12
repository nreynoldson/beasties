import request from 'superagent';
const { API_KEY, BACKEND_URL_PREFIX } = process.env;

const makeBackendUrl = (suffix) => `${API_KEY}.${BACKEND_URL_PREFIX}${suffix}`;

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

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/animal${id}`));

      return await handleRequest(req);
    }
  },

  User: {

    getInfo: async (id) => {

      const req = request
        .get(makeBackendUrl(`/user${id}`));

      return await handleRequest(req);
    }
  }
};

export default api;
