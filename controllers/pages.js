const axios = require("../utils/cachedAxios");

const controller = {};

/** Assignment data is coming from the Learning Guides in Strapi */

// Get all assignments
controller.getByCategory = async (req, res) => {
  let pagesCMS;
  let pages;

  // Get Learning Guides
  try {
    pagesCMS = (
      await axios.get(
        `${process.env.CMS_URL}/page-categories?UID=${req.params.categorySlug}`
      )
    ).data[0].pages;
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to fetch Pages by category",
      error: error,
    });
  }

  // Format Guides into Assignments
  try {
    pages = pagesCMS.map((page) => ({
      _id: page._id,
      title: page.Title,
      UID: page.UID,
    }));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error: Malformed pages", error: error });
  }

  return res.send(pages);
};

// Get specific assignment by _id
controller.get = async (req, res) => {
  let pageCMS;
  let page;

  // Get Learning Guide
  try {
    pageCMS = (
      await axios.get(`${process.env.CMS_URL}/pages?UID=${req.params.slug}`)
    ).data[0];
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to fetch Page",
      error: error,
    });
  }

  // try {
  // Format Guides into Assignments
  page = {
    _id: pageCMS._id,
    title: pageCMS.Title,
    UID: pageCMS.UID,
    content: pageCMS.Content.map((contentItem) => {
      // Format content
      switch (contentItem.__component) {
        case "page-content-components.text2":
          return {
            type: "text",
            value: contentItem.Text,
          };
        case "page-content-components.image":
          return {
            type: "image",
            value: {
              url: {
                small: contentItem.Image[0].formats.small.url,
                medium: contentItem.Image[0].formats.medium.url,
                large: contentItem.Image[0].formats.large.url,
              },
              caption: contentItem.Image[0].caption,
            },
          };
        default:
          return false;
      }
    }),
  };
  // } catch (error) {
  //   return res.status(500).send({
  //     message: "Error: Unable to form page",
  //     error: error,
  //   });
  // }

  return res.send(page);
};

module.exports = controller;
