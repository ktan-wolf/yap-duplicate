import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import axios from "axios";
import toast from "react-hot-toast";
import { Post as PostType} from "../utils/db/dummy";
import { useEffect, useState } from "react";

const getCookieToken = (): string | null => {
	const cookies = document.cookie.split("; ");
	for (const cookie of cookies) {
	  const [name, value] = cookie.split("=");
	  if (name === "token") {  // Ensure this matches the actual cookie name
		return value;
	  }
	}
	return null;
  };

function Posts({feedType, username, userId}: {feedType?: string, username?: string, userId?: string}){
	
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const cookieToken = getCookieToken(); // Get token from cookies
		if (cookieToken) {
		  localStorage.setItem("token", cookieToken); // Store in localStorage
		  setToken(cookieToken);
		} else {
		  toast.error("Authentication token missing. Please log in.");
		}
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