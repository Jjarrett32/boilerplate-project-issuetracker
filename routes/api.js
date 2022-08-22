"use strict";
const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      //?open=true&assigned_to=Joe
      const {
        id,
        open,
        issue_title,
        issue_text,
        created_by,
        asssigned_to,
        status_text,
      } = req.query;

      ProjectModel.aggregate([
        { $match: { name: projectName } },
        { $unwind: "$issues" },
        _id != undefined
          ? { $match: { "issues._id": ObjectId(_id) } }
          : { $match: {} },
        open != undefined
          ? { $match: { "issues._open": open } }
          : { $match: {} },
        issue_title != undefined
          ? { $match: { "issues.issue_title": issue_title } }
          : { $match: {} },
        issue_text != undefined
          ? { $match: { "issues.issue_text ": issue_text } }
          : { $match: {} },
      ]);
    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });
      console.log(newIssue);
      ProjectModel.findOne({ name: project }, (err, projectdata) => {
        if (!projectdata) {
          const newProject = new ProjectModel({ name: project });
          console.log(newProject);
          newProject.issues.push(newIssue);
          newProject.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectdata.issues.push(newIssue);
          projectdata.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
