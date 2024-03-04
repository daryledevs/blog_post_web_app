const corsOptions = {
  origin: [
    `${process.env.SERVER_URL_ONE}`,
    `${process.env.SERVER_URL_TWO}`,
    `${process.env.SERVER_URL_THREE}`,
  ],
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

export default corsOptions;