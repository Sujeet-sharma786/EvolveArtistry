import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import fileDownload from "js-file-download";

import "./listpotrait.css";
import { BiSearch } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
// import { isHtmlElement } from 'react-router-dom/dist/dom';
const ShowPotraits = () => {
  const [data, setData] = useState([]);
  const [showPrompt,setShowPrompt] = useState(false);
  const [name,setName] = useState("");
  const [desc,setDesc] = useState("");
  const [image,setImage] = useState("");
  const params = useParams();
  // const navigate = useNavigate();
  // let [name, setName] = useState('');
  useEffect(() => {
    getPotrait();
  }, []);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const User = localStorage.getItem("admin");
  
  const getPotrait = () => {
    axios
      .get(`${BASE_URL}/potrait`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err, "error has occured"));
  };
  // const numbers = [1, 2, 3, 4, 5];
  // let count = 0;

  const searchPotrait = async (key) => {
    // console.log("my key is", key);
    if (key) {
      let result = await fetch(`${BASE_URL}/search/${key}`);
      result = await result.json();
      if (result) {
        setData(result);
      }
    } else {
      getPotrait();
    }
  };
  // const DownloadImg = async (Value) => {
  //     let key = Value;

  //     let result = await fetch("http://localhost:5000/download", {
  //         method: "post",
  //         responseType: "blob",
  //         body: JSON.stringify({ name })
  //     })

  //     result = await result.json();
  //     console.log(result);
  //     fileDownload(result.data, "downloaded123.png");
  // }

  async function DownloadImg(e) {
    let myURL = e.currentTarget.getAttribute("data-value");
    // console.log(myURL);

    axios({
      url: `${BASE_URL}/download`,
      method: "POST",
      responseType: "blob",
      data: JSON.stringify({ myURL }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      // console.log(resp);
      fileDownload(resp.data, "downloaded123.png");
    });

    let result = await fetch(`${BASE_URL}/download`, {
      method: "post",
      responseType: "blob",
    });

    result = await result.json();
    // console.log(result);

    fileDownload(result.data, "downloaded123.png");
  }


  const handlePosting = ()=>{
    console.log(name,desc,image);
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("desc", desc);
    formdata.append("image", image);
    axios
      .post(`${BASE_URL}/upload/${params}`, formdata, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
        if (res.data.code === 403 && res.data.message === "Token Expired") {
          localStorage.setItem("token", null);
        }
      })
      .catch((err) => {
        console.log(err, "error has occured");
      });
  }

    const DeletePic = async (image_id) => {
      console.log(image_id);
      let data = await fetch(
        `${BASE_URL}/remove/${params.id}`,{
          method:"Delete",
          body:JSON.stringify({image_id}),
          headers:{"content-Type":"application/json"}
        });
  
      data = await data.json();
      // console.log(data);
      if (data) {
        toast("Successfully Deleted");
        window.location.reload();
      } else {
        toast("choose another name");
      }
    };

  return (

    <div>
      <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Box"
            className="searchBox"
            onChange={(e) => searchPotrait(e.target.value)}
          />
          <div className="searchicon1">
            <BiSearch color="white" onClick={searchPotrait} />
          </div>

        </div>

        <div>
         {
          User &&
           <button
           style={{
             width: "70px",
             height: "35px",
             borderRadius: "5px",
             backgroundColor: "green",
             color: "white",
             border: "none",
           }}
           onClick={() => setShowPrompt(true)}
         >
           Add Post
         </button>
         }
          {showPrompt && (
            <div
              style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "23px", // Increased by 10%
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
              }}
              
            >
              <h2 style={{ marginBottom: "15px" }}>Create a New Post</h2>
              <p style={{ marginBottom: "10px" }}>
                Fill in the details below to add a new post to your portfolio.
              </p>
              <h3>Add New Post</h3>
              <input
                type="text"
              
                onChange={(e)=>setName(e.target.value)}
                placeholder="Enter Title"
                style={{ display: "block", margin: "10px 0", width: "100%" }}
              />
              <textarea
                type="text"
                onChange={(e)=>setDesc(e.target.value)}
                placeholder="Enter Description"
                style={{ display: "block", margin: "10px 0", width: "100%" }}
              />
              <input
                type="file"
                onChange={(e)=>setImage(e.target.files[0])}
                style={{ display: "block", margin: "10px 0", width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    // Handle save logic here
                    setShowPrompt(false);
                    handlePosting();
                  }}
                >
                  Save
                </button>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  onClick={() => setShowPrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* <div style={{ float: "right"}} >
          <button style={{width:"70px",height:"35px",borderRadius:"5px",backgroundColor:"green",color:"white",border:"none"}}>Add Post</button>
        </div> */}
      </div>


      <div className="flex">
        {data.length > 0
          ? data.map((singledata, singleIndex) => {
            return (
              <div className="card">
                <div>
                  {/* <h3 className='name-h3'>{singledata?.name}</h3> */}
                  <img
                    src={`${BASE_URL}/${singledata?.imgUrl}`}
                    alt="..."
                    width="150"
                  />
                  <div className="download-delete-pic-div">
                    <button
                      className="btn2"
                      data-value={singledata?.imgUrl}
                      onClick={DownloadImg}
                      type="button"
                      fileDownload
                    >
                      Download
                    </button>
                    <button
                      className="btn2"
                      // data-value={singledata?.imgUrl}
                      onClick={(e)=>DeletePic(singledata?._id)}
                      type="button"
                      
                    >
                      Delete
                    </button>
                  </div>
                  {/* <h3 className='desc'>{singledata?.desc}</h3> */}
                </div>
              </div>
            );
          })
          : "no Data Found"}
      </div>
    </div>
  );
};

export default ShowPotraits;
