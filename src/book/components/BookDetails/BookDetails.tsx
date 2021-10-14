import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useBookService } from "../../services/BooksService";
import { BookProperties } from "../../book";
import { Label } from "./BookDetails.css";

interface ErrorMessages {
  required: string;
  maxLength: string;
  [key: string]: any;
}

interface ParamTypes {
  id: string;
}

const errorMessages: ErrorMessages = {
  required: "This field is required",
  maxLength: "Your input exceed maximum length",
};

const ErrorMessage = ({ msg }: { msg: string }) => <div style={{ color: "red" }}>{msg}</div>;

const initBook: BookProperties = { title: "", authors: "" };

export const BookDetails = () => {
  const { save, saveNew, findOne } = useBookService();
  const { id } = useParams<ParamTypes>();
  const { push } = useHistory();
  const methods = useForm({ defaultValues: initBook });
  const { handleSubmit, errors, setValue, control } = methods;

  useEffect(() => {
    if (id) {
      findOne(+id).then(({authors, title}) => {
        setValue('authors', authors);
        setValue('title', title);
      });
    }
  }, []);

  const notifyOnBookChange = (data: BookProperties) => {
    if (id) {
      save({ id: +id, ...data }).then(() => push("/book-app/books"));
    } else {
      saveNew(data).then(() => push("/book-app/books"));
    }
  };

  return (
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(notifyOnBookChange)} noValidate>
        <div className="form-group row">
          <Label htmlFor="authors" className="col-sm-3 col-form-label">
            Authors:
          </Label>
          <div className="col-sm-9">
            <Controller
                control={control}
                defaultValue=''
                name='authors'
                rules={{ required: true }}
                render={(props) => <input {...{ ...props }} />}
            />
            {errors.authors && (
              <ErrorMessage msg={errorMessages[errors.authors.type]} />
            )}
          </div>
        </div>
        <div className="form-group row">
          <Label htmlFor="title" className="col-sm-3 col-form-label">
            Title:
          </Label>
          <div className="col-sm-9">
            <Controller
                control={control}
                defaultValue=''
                name='title'
                rules={{ required: true, maxLength:15 }}
                render={(props) => <input {...{ ...props }} />}
            />
            {errors.title && (
              <ErrorMessage msg={errorMessages[errors.title.type]} />
            )}
          </div>
        </div>
        <div className="form-group row">
          <div className="offset-sm-3 col-sm-9">
            <button className="btn btn-primary">Apply</button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
