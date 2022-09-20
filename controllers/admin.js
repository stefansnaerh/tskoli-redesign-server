const mongoose = require("mongoose");
const Guides = require("../model/Guide");
const sanitizeHtml = require("sanitize-html");
const path = require('path');
const google = require('@googleapis/forms');
const {GoogleAuth} = require('google-auth-library');
const { resolve } = require("path");


const controller = {};


controller.create = async (req, res) => {
  // Create new guide
  try {
    const newID = mongoose.Types.ObjectId();
    req.body.Deliver.Title = sanitizeHtml(req.body.Deliver.Description);
    const newGuide = await Guides.create({
      _id: newID,
      Knowledge: req.body.Knowledge,
      Skills: req.body.Skills,
      Resources: req.body.Resources,
      Topics: req.body.Topics,
      Classes: req.body.Classes,
      Category: req.body.Category,
      Title: req.body.Title,
      topicsList: req.body.topicsList,
      Deliver: req.body.Deliver,
      project: req.body.project,
      Description: sanitizeHtml(req.body.Description),
      order: req.body.order,
      hidden: req.body.hidden,
      solution: req.body.solution,
      updatedAt: Date.now(),
    }, (error) => {
      console.log(error);
    });

    return res.send({ message: "Success", id: newID });// get new created guide's id and send it to the frontend
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.edit = async (req, res) => {
  req.body.Description = sanitizeHtml(req.body.Description);
  req.body.Deliver.Description = sanitizeHtml(req.body.Deliver.Description);

  try {
    const editGuide = await Guides.replaceOne(
      {
        _id: req.params._id,
      },
      {
        ...req.body, // spread syntax
        updatedAt: Date.now(),
      }
    );

    return res.send(editGuide);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.delete = async (req, res) => {

  try {

    const deleteGuide = await Guides.deleteOne(
      {
        _id: req.params._id,
      },
    );

    res.status(200).json({ message: 'Deleted this guide' })
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.getForm = async (req, res)=>{
  const formId = req.params._id;
  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/forms.responses.readonly',
      'https://www.googleapis.com/auth/forms.body.readonly'
    ]
  });
  const forms = google.forms({
    version: 'v1',
    auth: auth,
  });
  const resp = await forms.forms.responses.list({formId});
  const form = await forms.forms.get({formId});
  let questionCategory = "none";
  const questions = form.data.items.map((question)=>{
    if(question.textItem) questionCategory=question.title;
    return{
      title:question.title,
      id:question.questionItem?.question.questionId,
      category:questionCategory
    }
  }).filter(q=>q.id)
  const responses = resp.data.responses.map((response,i)=>{
    return questions.map(q=>{
        const o = {...q} //q will always reference the same object pointer
        try{ //if a question is not required to be answered this will produce an error
          o.answer = response.answers[q.id].textAnswers.answers[0].value
        }catch(err){console.log("the problematic question id is:",q.id)}
        return o;
      })
  })
  return res.status(200).send({responses});

}


module.exports = controller;

