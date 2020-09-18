import React from 'react';
import { useForm } from 'react-hook-form';

export default function Add() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onsubmit = data => console.log(data);

  return (
    <form onsubmit={handleSubmit(onsubmit)}>
      <input name="name" ref={register} />
      <input name="description" ref={register} />
      <input name="startDate" ref={register} />
      <input type="submit" />
    </form>
  )
};