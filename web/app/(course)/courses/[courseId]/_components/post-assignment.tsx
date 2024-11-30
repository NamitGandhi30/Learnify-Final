import { useState } from "react";

interface PostAssignmentProps {
  courseId: string;
}

export default function PostAssignment({ courseId }: PostAssignmentProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const response = await fetch("/api/assignments", {
      method: "POST",
      body: JSON.stringify({ title, description, dueDate, courseId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Assignment created");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <button type="submit">Create Assignment</button>
    </form>
  );
}
