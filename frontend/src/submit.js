// submit.js
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
            console.log("Backend Response:", data);
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
            <button className="bg-primary font-semibold text-white py-2 px-10 rounded-md" type="submit" onClick={handleSubmit}>Submit</button>
            <Toaster />
        </div>
    );
}
