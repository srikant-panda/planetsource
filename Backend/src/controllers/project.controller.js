import Project from "../models/project.model.js";

async function getProject(req, res) {
  try {
    if (!req.params.id) {
      const projects = await Project.find({ owner: req.user.id });
      if (projects.length == 0)
        return res
          .status(404)
          .json({ message: "No projects found.", found: false });
      return res.json({
        message: "Projects fetched successful.",
        found: true,
        count: projects.length,
        projects: projects,
      });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "No project found.", found: false });
    res.json({
      message: "Project fetched successful.",
      found: true,
      project: project,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal error", name: err.name });
  }
}

async function postProject(req, res) {
  try {
    const { name, description } = req.body;
    const UserId = req.user.id;
    if (!name)
      return res.status(400).json({ message: "Invlaid Data.", success: false });

    const project = await Project.create({
      name: name,
      description: description,
      owner: UserId,
    });

    if (project)
      return res.status(201).json({
        message: "Project created successful.",
        success: true,
        details: project,
      });
  } catch (err) {
    res.status(500).json({ message: "Internal error", name: err.name });
  }
}

async function deleteProject(req,res) {
  try{
  const projectId = req.params?.id;
  const userId = req.user.id;
  if(!projectId)  return res.status(400).json({ message: "Insufficient data.",success:false});
  const result = await Project.deleteOne({_id:String(projectId),owner:userId});
  if(result.deletedCount !==1 ) return res.status(404).json({ message:"No project found with this id.",success:false});
  res.json({
    message:"Project deleted.",
    success:true,
  })
} catch(err){
  console.log(err);
  res.status(500).json({ message: "Internal error", name: err.name });
}
}

async function  patchProject(req,res) {
  const { name , description } = req.body;
  const id = req.params?.id;
  const UserId = req.user.id;
  if(!name) return res.status(400).json({message:"Invalid data.Name required"});
  // const projectData = await Project.findOneAndUpdate(,{ })
}


async function putProject(params) {
  
}




const projectController = {
  getProject,
  postProject,
  deleteProject
}

export default projectController;