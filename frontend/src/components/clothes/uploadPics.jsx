import axios from "axios";

const UploadImages = (props) => {
  const uploadWidget = () => {
    console.log(6, window.cloudinary)
    console.log(7, 
      'cloud_name:', import.meta.env.VITE_CLOUD_NAME,
      'upload_preset:', import.meta.env.VITE_UPLOAD_PRESET,
      'api_key:', import.meta.env.VITE_CLOUD_API_KEY
    )
    // remember to add your credentials to the .env file
    window.cloudinary.openUploadWidget(
      {
        cloud_name: import.meta.env.VITE_CLOUD_NAME,
        upload_preset: import.meta.env.VITE_UPLOAD_PRESET,
        api_key: import.meta.env.VITE_CLOUD_API_KEY,
        tags: ["user"],
        sources: ["local", "url", "camera", "image_search"],

      },
      (error, result) => {
        if (error) {
          console.log('Cloudinary Widget Error: ', error);
        } else {
          result.event === "queues-end" && upload_picture(result);
        }
      }
    );
  };

  const upload_picture = async (result) => {
    try {
      console.log(result);
      const response = await axios.post(
        "http://localhost:4444/pictures/upload",
        {
          files: result.info.files,
        }
      );
      response.data.ok
        ? await props.fetch_pictures()
        : alert("Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };
  // function to send data to server to create a new post
  return (
    <div className="flex_upload">
      {/* form to add title, description, author, date -- onchange goes to state */}
      <div className="upload">
        <button className="button" onClick={uploadWidget}>
          Open widget
        </button>
      </div>
      {/* button PUBLISH POST on click take data from state and send to server on the body -- function*/}
    </div>
  );
};

export default UploadImages;