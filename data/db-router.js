const express = require("express");
const Data = require("./db");

const router = express.Router();

router.post("/", (req, res) => {
  Data.insert(req.body)
    .then(post => {
      if (!post.title || !post.contents) {
        res.status(201).json(post);
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.post("/:id/comments", (req, res) => {
  //   const postId = req.params.id;
  //   const comment = { ...req.body, post_id: postId };

  //   Data.findById(postId).then(response => {
  //     if (response.length) {
  //       comment.text
  //         ? Data.insertComment(comment)
  //             .then(commentId => {
  //               res.status(201).json({ ...comment, ...commentId });
  //             })
  //             .catch(err => {
  //               res.status(500).json({
  //                 error:
  //                   "There was an error while saving the comment to the database."
  //               });
  //             })
  //         : res
  //             .status(400)
  //             .json({ errorMessage: "Please provide text for the comment." });
  //     } else {
  //       res
  //         .status(404)
  //         .json({ message: "The post with the specified ID does not exist." });
  //     }
  //   });
  const postId = req.params.id;
  const comment = { ...req.body, post_id: postId };

  Data.findById(postId).then(post => {
    if (post.length) {
      if (comment.text) {
        Data.insertComment(comment)
          .then(data => {
            res.status(201).json({ ...comment, ...data });
          })
          .catch(err => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      }
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  });
});

router.get("/", (req, res) => {
  Data.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Data.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Data.findCommentById(req.params.id)
    .then(comment => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Data.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const post = req.body;
  Data.update(id, post)
    .then(data => {
      if (data) {
        if (post.title || post.contents) {
          res.status(200).json(post);
        } else {
          res.status(400).json({
            message: "The post with the specified ID does not exist."
          });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
