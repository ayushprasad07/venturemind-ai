"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const fetchData = async (ideaId : string) => {
    const response = await axios.get(`/api/fetch-idea-by-id/${ideaId}`);

    if(response.data.success){
        return response.data.data;
    }

    if(!response.data.success){
        throw new Error(response.data.message);
    }
}

const Idea = () => {
    const { ideaId } = useParams();

    const {
        data : idea,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey : ["idea", ideaId],
        queryFn : () => fetchData(ideaId as string),
        enabled : !!ideaId
    })

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>{error.message}</div>
    }
  return (
    <div>
      <h1>Idea Details</h1>

      <p><strong>ID:</strong> {ideaId}</p>

      <p><strong>Title:</strong> {idea?.title}</p>

      <p><strong>Description:</strong> {idea?.idea}</p>

      <p><strong>Analysis:</strong> {idea?.analysis}</p>
    </div>
  )
}

export default Idea
