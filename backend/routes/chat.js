import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//create test thread
router.post("/test", async(req,res) => {
    try{
        const thread = new Thread({
            threadId: "xyz2",
            title: "New testing thread2",
        });
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in DB"});
    }
})
//get all threads
router.get("/thread", async (req,res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt : -1});
        res.json(threads);
    }catch(err){
        console.log(err);
    }
})
router.get("/thread/:threadId", async (req,res) => {
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});

        if(!thread) return res.status(404).json({error: "Thread not found"});
        res.json(thread);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
})
router.delete("/thread/:threadId", async (req,res) => {
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) return res.status(404).json({error: "Thread not found"});
        res.status(200).json({success: "Thread deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to find thread"});
    }
})
router.post("/chat", async (req,res) => {
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error: "missing required feilds"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            thread = new Thread({
                threadId, 
                title: message,
                messages: [{role: "user", content: message}]
            })
        }
        else thread.messages.push({role: "user", content: message});

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply: assistantReply});

    }catch(err){
        console.log(err);
        res.status(404).json({error: "Something went wrong"});
    }
})

export default router;