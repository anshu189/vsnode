// submit.js
import { CircleCheck } from "lucide-react";
import { useStore } from "./store";
import toast, { Toaster } from 'react-hot-toast';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("pipeline", JSON.stringify({ nodes, edges }));

            const response = await fetch("http://localhost:8000/pipelines/parse", {
                method: "POST",
                CORS: 'no-cors',
                body: formData, // send as form data
            });

            const data = await response.json();
            if(data.num_nodes === 0 && data.num_edges === 0){
                // If workflow is empty
                toast.error("Please add atleast one node.", {
                    duration: 2000,
                    position: 'top-right',
                });
            }
            else{
                toast.success(`num_nodes: ${data.num_nodes} \n num_edges: ${data.num_edges} \n is_dag: ${data.is_dag}`, {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        padding:'6px 22px',
                        color: '#f7f7f7',
                        background: '#1a1a1a'
                    },
                    iconTheme: {
                        primary: '#05bd05ff',
                        secondary: '#fff',
                    },
                    removeDelay: 1000,
                });
            }
        } catch (error) {
            toast.error("Error submitting pipeline", {
                duration: 2000,
                position: 'top-right',
            });
            // Developer log
            console.error("Error submitting pipeline:", error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button className="flex gap-3 items-center bg-primary border-2 border-bg-light text-lg font-semibold text-bg-light py-3 px-5 rounded-lg focus:ring-2 focus:ring-primary duration-200" type="submit" onClick={handleSubmit}>
                <CircleCheck className="inline-block" />
                Submit
            </button>
            <Toaster />
        </div>
    );
}
