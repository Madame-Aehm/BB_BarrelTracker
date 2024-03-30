import serverBaseURL from "./utils/baseURL";

type VersionRes = { version: string }

const getVersion = async() => {
  const version = localStorage.getItem("version");
  console.log(version);
  try {
    const response = await fetch(`${serverBaseURL}/api/version`);
    const result = await response.json() as VersionRes;
    console.log(result);
    if (result.version !== version) {
      localStorage.setItem("version", result.version);
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

export default getVersion