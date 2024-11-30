import { SetStateAction, useState } from "react";

interface SubmitAssignmentProps {
  assignmentId: string;
  studentId: string;
}

export default function SubmitAssignment({ assignmentId, studentId }: SubmitAssignmentProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);

    const response = await fetch("/api/submissions", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Assignment submitted");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Submit Assignment</button>
    </form>
  );
}
