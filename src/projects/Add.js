import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import "./Add.css"

export default function Add() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <>
      <div>
        <Link to="/">List</Link>
      </div>
      <form className="add-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-item">
          <label for="name">Name</label>
          <input {...register('name', { required: true, maxLength: 100 })} />
        </div>
        {errors.name && <p>Project Name is required.</p>}
        <div className="form-item">
          <label for="name">Initial Contributions</label>
          <input {...register('contributions')} type="number" />
        </div>
        {errors.name && <p>Project Name is required.</p>}
        <div className="form-item">
          <label for="img">Image</label>
          <input {...register('img')} />
        </div>
        {errors.name && <p>Image name is required.</p>}
        <div className="form-item">
          <label for="startDate">Start Date</label>
          <input {...register('startDate')} type="date" />
        </div>
        <div className="form-item">
          <label for="description">Description</label>
          <textarea {...register('description')} rows="4" />
        </div>
        <div className="form-action">
          <input type="submit" />
        </div>
      </form>
    </>
  )
};