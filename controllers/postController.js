const { result } = require('lodash');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const get_feed = (req,res)=>{
    const lastId = req.query.lastId;
    console.log('params: ' + req.query);
    if(lastId == null){
        Post.Post.find().limit(10).then((result)=>{
            return res.status(200).json({posts:result})
        }).catch((err)=>{
            return res.status(400).send('Failed to Get Posts');
        });
    }else{
        Post.Post.find({'_id': {'$gt': lastId}}).limit(10).then((result)=>{
            return res.status(200).json({posts:result})
        }).catch((err)=>{
            return res.status(400).send('Failed to Get Posts');
        });
    }
}

const get_my_posts = (req,res)=>{
    const lastId = req.query.lastId;
    if(lastId==null){
        Post.Post.find({'userId':req.header('id')}).limit(10).then((result)=>{
            return res.status(200).json({posts:result})
        }).catch((err)=>{
            return res.status(400).send('Failed to Get Posts');
        });
    }else{
        Post.Post.find({'userId':req.header('id'),'_id': {'$gt': lastId} }).limit(10).then((result)=>{
            return res.status(200).json({posts:result})
        }).catch((err)=>{
            return res.status(400).send('Failed to Get Posts');
        });
    }
}


const create_post = (req,res)=>{
    const post= new Post.Post({
        userId:mongoose.Types.ObjectId(req.header('id')),
        title: req.body.title,
        userEmail: req.body.userEmail,
        body: req.body.body,
    });
    post.save().then((result)=>{
        return res.json({'Success':'Complete'});
    }).catch((err)=>{
        console.log(err);
        return res.status(400).send('Failed to Create Post');
    });
}

const create_comment = (req,res)=>{
    const userId = req.body.userId;
    const blogId = req.body.blogId;
    const comment = req.body.comment;
    const userEmail = req.body.userEmail;
    const userComment = Post.Comment({
        _id: mongoose.Types.ObjectId(userId),
        comment: comment,
        userEmail: userEmail
    });
    Post.Post.findById(blogId).then((result) => {
        result.updateOne({
            $addToSet:{"comments":userComment}
        }).then((resu)=>{
            return res.status(200).send(resu);
        }).catch((error)=>{
            return res.status(400).send(error);
        });
    }).catch((err)=>{
        return res.status(400).send(err);
    });
    // Post.Post.findByIdAndUpdate(
    //     { _id: userId },
    //     {
    //         $addToSet:{"comments":userComment}
    //     },
    //     { new: true },
    //     function (err, post) {
    //         if (err) return res.status(404).send(err);
    //         return res.status(200).send(post);
    //     }
    // );
    // Post.Post.findById(blogId).then((result)=>{
    //     var hasComment = false;
    //     for (let index = 0; index < result.comments.length; index++) {
    //         const element = result.comments[index];
    //         if(element._id == userId){
    //             hasComment = true;
    //             result.updateOne({
    //                 $pull:{"comments":element}
    //             }).then((resul)=>{
    //                 result.updateOne({
    //                     $addToSet:{"comments":userComment}
    //                 }).then((resu)=>{
    //                     return res.status(200).send("Updated Comment");
    //                 })
    //             }).catch((err)=>{
    //                 return res.status(400).send("Failed to Update Comment");
    //             });
    //         }
    //     }
        
    //     if(hasComment==false){
    //         result.updateOne({
    //             $addToSet:{"comments":userComment}

    //         }).then((result)=>{
    //             return res.status(200).send("Created Comment");
                
    //         }).catch((err)=>{ 
    //             return res.status(400).send("Failed to Create Comment");
    //         });
    //     }else{
    //         return;
    //     }
        

    // }).catch((err)=>{
    //     return res.status(400).send("Failed to Find post");
    // });

}

const update_post = (req, res) => {
    console.log(req.body)
    Post.Post.findByIdAndUpdate(
        {
            _id: req.body.blogId,
        },
        {
            $set: {
                title: req.body.title,
                body: req.body.body,
            }
        },
        {new: true},
        function (err, post) {
            if (err) return res.status(404).send(err);
            return res.status(200).send(post);
        }
    );
}

const delete_post = (req,res)=>{
    const blogId = req.body.blogId;
    Post.Post.findByIdAndDelete(blogId).then((result)=>{
        return res.json({'Success':'Complete'});
    }).catch((err)=>{
        return res.status(400).send('Failed to Delete Post');
    });

}

const hasLike = (likes, id) =>{
    var  containsLike = false;
    likes.forEach(element => {
        if(element == id){
            containsLike = true;
            return containsLike;
        }
    });
    return containsLike;
}

const like_unlike_post = (req,res)=>{
    const blogId = req.body.blogId;
    const userId = req.body.userId;
    Post.Post.findById(blogId).then((result)=>{
        if(hasLike(result.likes,userId)){
            result.updateOne({$pull:{"likes":userId}}).then((result)=>{
                return res.status(200).send("Unliked Post");
            }).catch((err)=>{
                return res.status(400).send("Failed to Unlike");
            });
        }else{
            result.updateOne({$addToSet:{"likes":userId}}).then((result)=>{
                return res.status(200).send("Liked Post");
            }).catch((err)=>{
                return res.status(400).send("Failed to Like");
            });   
        }
    }).catch((err)=>{
        return res.status(400).send("Failed");
    });
}


module.exports = {
    create_post,
    delete_post,
    like_unlike_post,
    create_comment,
    get_feed,
    get_my_posts,
    update_post
};
