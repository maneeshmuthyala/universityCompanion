import React, { Component } from 'react';

class Assignments extends Component {
    state = { 
        assignments: [], 
        showAddAssignmentForm: false,
        showEditAssignmentForm: false,
        newAssignment: { title: '', course: '', due_date: '', status: 'incomplete' },
        editAssignment: null,
    };

    componentDidMount() {
        this.getAssignments();
    }

    getAssignments = async () => {
        try {
            const res = await fetch("http://localhost:8081/assignments");
            const data = await res.json();
            const { courseId } = this.props;
            const filteredAssignments = data.filter(assignment => assignment.course === courseId);
            this.setState({ assignments: filteredAssignments });
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    handleNewAssignmentChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newAssignment: { ...prevState.newAssignment, [name]: value }
        }));
    };

    handleEditAssignmentChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            editAssignment: { ...prevState.editAssignment, [name]: value }
        }));
    };

    toggleAddAssignmentForm = () => {
        this.setState((prevState) => ({ showAddAssignmentForm: !prevState.showAddAssignmentForm }));
    };

    toggleEditAssignmentForm = (assignment) => {
        this.setState({ showEditAssignmentForm: true, editAssignment: assignment });
    };

    closeEditAssignmentForm = () => {
        this.setState({ showEditAssignmentForm: false, editAssignment: null });
    };

    addNewAssignment = async () => {
        try {
            const response = await fetch("http://localhost:8081/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.newAssignment),
            });
            if (response.ok) {
                this.getAssignments();
                this.toggleAddAssignmentForm();
            }
        } catch (error) {
            console.error("Error adding new assignment:", error);
        }
    };

    updateAssignment = async () => {
        try {
            const response = await fetch(`http://localhost:8081/assignments/${this.state.editAssignment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.editAssignment),
            });
            if (response.ok) {
                this.getAssignments();
                this.closeEditAssignmentForm();
            }
        } catch (error) {
            console.error("Error updating assignment:", error);
        }
    };

    deleteAssignment = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/assignments/${id}`, { method: "DELETE" });
            if (response.ok) {
                this.getAssignments();
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    toggleCompletion = async (assignment) => {
        try {
            const updatedAssignment = { ...assignment, status: assignment.status === "completed" ? "incomplete" : "completed" };
            const response = await fetch(`http://localhost:8081/assignments/${assignment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedAssignment),
            });
            if (response.ok) {
                this.getAssignments();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    render() {
        const { assignments, showAddAssignmentForm, showEditAssignmentForm, newAssignment, editAssignment } = this.state;

        return (
            <>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Title</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Due Date</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => (
                            <tr key={assignment.id}>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{assignment.title}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{assignment.due_date}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{assignment.status}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                    <button onClick={() => this.toggleEditAssignmentForm(assignment)}>Edit</button>
                                    <button onClick={() => this.deleteAssignment(assignment.id)}>Delete</button>
                                    <button onClick={() => this.toggleCompletion(assignment)}>
                                        {assignment.status === "completed" ? "Mark Incomplete" : "Mark Completed"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={this.toggleAddAssignmentForm}>New Assignment</button>

                {showAddAssignmentForm && (
                    <div>
                        <h2>Add New Assignment</h2>
                        <input 
                            type="text" 
                            name="title" 
                            value={newAssignment.title} 
                            onChange={this.handleNewAssignmentChange} 
                            placeholder="Title"
                        />
                        <input 
                            type="date" 
                            name="due_date" 
                            value={newAssignment.due_date} 
                            onChange={this.handleNewAssignmentChange} 
                        />
                        <select 
                            name="status" 
                            value={newAssignment.status} 
                            onChange={this.handleNewAssignmentChange}
                        >
                            <option value="incomplete">Incomplete</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button onClick={this.addNewAssignment}>Add</button>
                        <button onClick={this.toggleAddAssignmentForm}>Cancel</button>
                    </div>
                )}

                {showEditAssignmentForm && editAssignment && (
                    <div>
                        <h2>Edit Assignment</h2>
                        <input 
                            type="text" 
                            name="title" 
                            value={editAssignment.title} 
                            onChange={this.handleEditAssignmentChange} 
                            placeholder="Title"
                        />
                        <input 
                            type="date" 
                            name="due_date" 
                            value={editAssignment.due_date} 
                            onChange={this.handleEditAssignmentChange} 
                        />
                        <select 
                            name="status" 
                            value={editAssignment.status} 
                            onChange={this.handleEditAssignmentChange}
                        >
                            <option value="incomplete">Incomplete</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button onClick={this.updateAssignment}>Save</button>
                        <button onClick={this.closeEditAssignmentForm}>Cancel</button>
                    </div>
                )}
            </>
        );
    }
}

export default Assignments;
