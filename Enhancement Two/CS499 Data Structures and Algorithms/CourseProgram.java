// Emeth Jamison
// CS499 Enhancement Two: Data Structures and Algorithms
// Professor Sanford
// November 23, 2025

import java.io.*;
import java.util.*;

public class CourseProgram {

    private static CourseManager courseManager = new CourseManager();
    private static String filename = "ABCU_Advising_Program_Input.txt";

    public static void main(String[] args) { // Main function for program
        Scanner scanner = new Scanner(System.in);
        int option;

        do {
            displayMenu();
            option = scanner.nextInt();
            scanner.nextLine();
            handleMenuOption(option, scanner);
        } while (option != 9);

        scanner.close();
    }

    private static void displayMenu() { // Menu print method
        System.out.println("\nMenu:");
        System.out.println("1. Load file data into data structure");
        System.out.println("2. Print all courses in alphanumeric order");
        System.out.println("3. Print a course's title and prerequisites");
        System.out.println("9. Exit");
        System.out.print("Enter your choice: ");
    }

    private static void handleMenuOption(int option, Scanner scanner) { // Menu switch case handler method
        switch (option) {
            case 1:
                if (loadDataFromFile(filename)) {
                    System.out.println("File data loaded successfully.");
                } else {
                    System.out.println("Error loading file data.");
                }
                break;

            case 2:
                courseManager.printAllCourses();
                break;

            case 3:
                System.out.print("Enter course number: ");
                String courseNumber = scanner.nextLine();
                searchAndPrintCourse(courseNumber);
                break;

            case 9:
                System.out.println("Exiting program.");
                break;

            default: // default case in case of invalid input
                System.out.println("Invalid option. Please try again.");
                break;
        }
    }

    private static boolean loadDataFromFile(String filename) { // Loads data file and parses data
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line;

            while ((line = br.readLine()) != null) {
                String[] tokens = line.split(",");

                if (tokens.length < 2) {
                    System.out.println("Error: Invalid format in line: " + line);
                    continue;
                }

                String courseNumber = tokens[0].trim();
                String courseName = tokens[1].trim();
                Course course = new Course(courseNumber, courseName);

                for (int i = 2; i < tokens.length; i++) {
                    course.prerequisites.add(tokens[i].trim());
                }

                courseManager.addCourse(course);
            }

            // Validate prerequisites after loading all courses
            return courseManager.validatePrerequisites();

        } catch (IOException e) { // Error handling if file error happens
            System.out.println("Error: Unable to open file.");
            return false;
        }
    }

    private static void searchAndPrintCourse(String courseNumber) { // Logic for searching and printing a course
        Course course = courseManager.getCourse(courseNumber);
        if (course != null) {
            System.out.println("Course Number: " + course.courseNumber + ", Course Name: " + course.courseName);

            if (course.prerequisites.isEmpty()) {
                System.out.println("No prerequisites");
            } else {
                System.out.print("Prerequisites: ");
                for (String prereq : course.prerequisites) {
                    System.out.print(prereq + " ");
                }
                System.out.println();
            }
        } else {
            System.out.println("Course not found.");
        }
    }
}


// Course class
class Course implements Comparable<Course> {
    // Course variables
    String courseNumber;
    String courseName;
    ArrayList<String> prerequisites;

    public Course(String courseNumber, String courseName) { // Constructor
        this.courseNumber = courseNumber;
        this.courseName = courseName;
        this.prerequisites = new ArrayList<>();
    }

    @Override
    public int compareTo(Course other) {
        return this.courseNumber.compareTo(other.courseNumber);
    }
}


// CourseManager class
class CourseManager {

    private ArrayList<Course> courses; // ArrayList for courses: serves as vector

    public CourseManager() {
        courses = new ArrayList<>();
    }

    public void addCourse(Course course) { // Adds a course to the course ArrayList
        courses.add(course);
    }

    public boolean courseExists(String courseNumber) { // Checks if a course exists
        return getCourse(courseNumber) != null;
    }

    public Course getCourse(String courseNumber) { // Getter method for a course
        for (Course course : courses) {
            if (course.courseNumber.equals(courseNumber)) {
                return course;
            }
        }
        return null;
    }

    public void printAllCourses() { // Printing method for all courses
        Collections.sort(courses);

        for (Course course : courses) {
            System.out.println("Course Number: " + course.courseNumber + ", Course Name: " + course.courseName);

            if (course.prerequisites.isEmpty()) {
                System.out.println("No prerequisites");
            } else {
                System.out.print("Prerequisites: ");
                for (String prereq : course.prerequisites) {
                    System.out.print(prereq + " ");
                }
                System.out.println();
            }
        }
    }

    public boolean validatePrerequisites() { // Method to validate prerequisite courses
        Set<String> allCourseNumbers = new HashSet<>();
        for (Course c : courses) {
            allCourseNumbers.add(c.courseNumber);
        }

        for (Course course : courses) {
            for (String prereq : course.prerequisites) {
                if (!allCourseNumbers.contains(prereq)) {
                    System.out.println("Error: Prerequisite " + prereq + " does not exist for course " + course.courseNumber);
                    return false;
                }
            }
        }
        return true;
    }

}
