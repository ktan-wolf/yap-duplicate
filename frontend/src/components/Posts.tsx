import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import axios from "axios";
import toast from "react-hot-toast";
import { Post as PostType} from "../utils/db/dummy";
import { useEffect, useState } from "react";

const getAuthToken = async () => {
	try {
	  const response = await fetch("https://your-backend.com/api/auth/protected-route", {
		method: "GET",
		credentials: "include", // Ensures cookies are sent
	  });
  
	  const data = await response.json();
	  if (data.token) {
		localStorage.setItem("token", data.token); // Store token for API requests
		console.log("Token stored:", data.token);
	  }
	  console.log("token badi mehnat baad:", data.token);
  
	} catch (error) {
	  console.error("Error fetching user data:", error);
	}
  };

function Posts({feedType, username, userId}: {feedType?: string, username?: string, userId?: string}){
	
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
		  await getAuthToken(); // Fetch token (stores it in LocalStorage)
		  const authToken = localStorage.getItem("token"); // Get it from LocalStorage
	  
		  if (authToken) {
			setToken(authToken); // ✅ Set token only after it's stored
		  } else {
			console.log("yhi hai na dikkat");
			toast.error("Authentication token missing. Please log in.");
		  }
		};
	  
		fetchToken(); // Call async function inside useEffect
	  }, []);
	  

  const getPostEndPoint = () =>{
	switch(feedType){
		case "forYou": return '/api/posts/all';
		case "following": return '/api/posts/following';
		case "posts": return `/api/posts/user/${username}`;
		case "likes": return `/api/posts/likes/${userId}`;
		default: return 'api/posts/all'; 
	}
  }

  const POST_ENDPOINT = getPostEndPoint();
  const { data: posts, isLoading, refetch, isRefetching } = useQuery<PostType[]>({
    queryKey: ["posts", feedType, username, userId], // Dynamic query key
    queryFn: async () => {
		if (!token) {
			throw new Error("No authentication token found");
		  }
	
		  try {
			const res = await axios.get<PostType[]>(POST_ENDPOINT, {
			  headers: { Authorization: `Bearer ${token}` },
			  withCredentials: true,
			});
	
			return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg = error.response?.data?.message || "An unexpected error occurred";
          toast.error(errorMsg);
        } else {
          toast.error("An unexpected error occurred");
        }
        return [];
      }
    },
	enabled: !!token, // Only run the query if token exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  

  useEffect(() => {
    refetch();
  }, [feedType, username, userId, refetch , token]); // Ensure it refetches when dependencies change

  return (
    <>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching &&posts?.length === 0 && <p className='text-center my-4'>No posts 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
  )
}

export default Posts