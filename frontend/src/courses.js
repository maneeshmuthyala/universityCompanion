import React, { Component } from 'react';

class Courses extends Component {
    state = { 
        da: [], 
        showAddCourseForm: false,
        newCourse: { course_name: '', professor: '', start_date: '', end_date: '' }
    };

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        try {
            const res = await fetch("http://localhost:8081/courses");
            const data = await res.json();
            this.setState({ da: data });
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    handleNewCourseChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newCourse: { ...prevState.newCourse, [name]: value }
        }));
    };

    toggleAddCourseForm = () => {
        this.setState((prevState) => ({ showAddCourseForm: !prevState.showAddCourseForm }));
    };

    addNewCourse = async () => {
        try {
            const response = await fetch("http://localhost:8081/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.newCourse),
            });
            if (response.ok) {
                this.getData(); 
                this.toggleAddCourseForm(); 
            }
        } catch (error) {
            console.error("Error adding new course:", error);
        }
    };

    render() {
        const { da, showAddCourseForm, newCourse } = this.state;

        return (
            <>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Course Name</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Professor</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>Start Date</th>
                            <th style={{ border: "1px solid black", padding: "8px" }}>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {da.map((each) => (
                            <tr key={each.id}>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{each.course_name}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{each.professor}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{this.formatDate(each.start_date)}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{this.formatDate(each.end_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={this.toggleAddCourseForm}>New Course</button>

                {showAddCourseForm && (
                    <div>
                        <h2>Add New Course</h2>
                        <input 
                            type="text" 
                            name="course_name" 
                            placeholder="Course Name" 
                            value={newCourse.course_name} 
                            onChange={this.handleNewCourseChange} 
                        />
                        <input 
                            type="text" 
                            name="professor" 
                            placeholder="Professor" 
                            value={newCourse.professor} 
                            onChange={this.handleNewCourseChange} 
                        />
                        <input 
                            type="date" 
                            name="start_date" 
                            placeholder="Start Date" 
                            value={newCourse.start_date} 
                            onChange={this.handleNewCourseChange} 
                        />
                        <input 
                            type="date" 
                            name="end_date" 
                            placeholder="End Date" 
                            value={newCourse.end_date} 
                            onChange={this.handleNewCourseChange} 
                        />
                        <button onClick={this.addNewCourse}>Add Course</button>
                    </div>
                )}
            </>
        );
    }
}

export default Courses;
