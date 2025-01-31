import { TextField, Box, Divider, Typography } from "@mui/material";
import IconWithTitle from "../course-product/IconWithTitle";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import TextSection from "../course-product/TextSection";

import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect } from "react";

/**
 * AboutCourse component renders a page for instructors to input course title,
 * course description, and learning objective of the course.
 *
 * It uses the TextSection component to render each section.
 *
 * @returns a JSX element containing the AboutCourse component.
 */

export default function AboutCourse() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const course = useSelector((state) => state.course.courseData);

  useEffect(() => {
    if (course) {
      const { name, description, courseObjective } = course;

      setValue("courseName", name);
      setValue("description", description);
      setValue("courseObjective", courseObjective);
    }
  }, [course, setValue]);

  const courseName = watch("courseName");
  const description = watch("description");
  const courseObjective = watch("courseObjective");

  return (
    <Box className="container">
      <IconWithTitle
        title="About Course"
        icon={<NewspaperOutlinedIcon sx={{ color: "common.white" }} />}
      />
      <Divider sx={{ my: 2 }} />
      <TextSection
        title="Let's craft a course title"
        description="Craft a good title would help your content engage more students."
      />
      <TextField
        sx={{ my: 2 }}
        fullWidth
        id="courseName"
        slotProps={{
          inputLabel: { shrink: (course && !!course.name) || !!courseName },
        }}
        label={`Course Title ${courseName ? `: ${courseName.length} / 70` : ""}`}
        value={watch("courseName")}
        {...register("courseName", {
          required: "Title is required",
          maxLength: {
            value: 70,
            message: "Title cannot be exceed 70 characters",
          },
        })}
        error={!!errors.courseName}
        helperText={errors.courseName?.message}
      />
      <Typography variant="bsr" color="dark.300" sx={{ mt: 2 }}>
        eg: How to plant an indoor tomatoes 100% edible
      </Typography>

      <Box mt={4}>
        <TextSection
          title="Tell us more about your course"
          description="It is important to describe your course in detail so that it is easy for students to understand the course."
        />
        <TextField
          id="description"
          slotProps={{
            inputLabel: {
              shrink:
                (course && !!course.description) || !!watch("description"),
            },
          }}
          sx={{ my: 2 }}
          fullWidth
          multiline
          minRows={3}
          label={`Course Description ${description ? `: ${description.length} / 1000` : ""}`}
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 1000,
              message: "Description cannot be exceed 1000 characters",
            },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Box>
      <TextSection
        title="What student will learn in this course?"
        description="Describe the learning objective of this course that learner expect to
          achieve after completing this course"
      />
      <TextField
        slotProps={{
          inputLabel: {
            shrink:
              (course && !!course.courseObjective) ||
              !!watch("courseObjective"),
          },
        }}
        sx={{ my: 2 }}
        fullWidth
        multiline
        minRows={3}
        id="courseObjective"
        label={`Course Objective ${courseObjective ? `: ${courseObjective.length} / 1000` : ""}`}
        value={watch("courseObjective")}
        {...register("courseObjective", {
          required: "Objective is required",
          maxLength: {
            value: 1000,
            message: "course objectives cannot be exceed 1000 characters",
          },
        })}
        error={!!errors.courseObjective}
        helperText={errors.courseObjective?.message}
      />
    </Box>
  );
}
