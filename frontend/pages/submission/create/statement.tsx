import { FormEvent, useCallback, useState } from "react";
import { CreateSubmissionLayout } from "../../../layouts/CreateSubmissionLayout";
import styles from '../../../styles/Submission.module.scss';
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import debounce from 'lodash/debounce';
import {
  selectYourStatement,
  setYourStatement,
} from "../../../store/submissionSlice";


const CreateSubmissionStatement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const yourStatement = useAppSelector(selectYourStatement);
  const [value, setValue] = useState(yourStatement)

  const debounceSetLink = (value) => {
    dispatch(setYourStatement(value));
  }

  const debouncedHandler = useCallback(debounce(debounceSetLink, 1000), []);

  const onTextareaChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setValue(value);
    debouncedHandler(value);
  };

  const onButtonClick = () => {
    router.push("/submission/create/statement")
  }

  return (
    <CreateSubmissionLayout
      submitButtonText="Submit"
      onSubmit={onButtonClick}
      isSubmitAvailable={true}
      isCancelAvailable={true}
    >
      <div className={styles.statementDescription}>
        <p>
          Why was this insightful for you?
        </p>
        <p>
          Your statement will be visible for others and can help them understand the value of your submission.
        </p>
      </div>
      <div>
        <div className={styles.textareaLabel}>Optional</div>
        <textarea 
          value={value}
          className={styles.textarea} 
          placeholder="Text"
          onChange={onTextareaChange}
        ></textarea>
      </div>
    </CreateSubmissionLayout>
  )
}

export default CreateSubmissionStatement;


export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}