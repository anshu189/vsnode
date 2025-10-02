// submit.js
import { useStore } from "./store";

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    // console.log("nodes", nodes);
    // console.log("edges", edges);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("pipeline", JSON.stringify({ nodes, edges }));

            const response = await fetch("http://127.0.0.1:8000/pipelines/parse", {
                method: "POST",
                CORS: 'no-cors',
                body: formData, // send as form data
            });

            const data = await response.json();
            console.log("Backend Response:", data);
            // alert(`Pipeline parsed: ${data.num_nodes} nodes, ${data.num_edges} edges`);
        } catch (error) {
            console.error("Error submitting pipeline:", error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>
    );
}
