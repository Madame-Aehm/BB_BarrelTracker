type VersionRes = { version: string }

const getVersion = async() => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
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