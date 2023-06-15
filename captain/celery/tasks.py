from captain.celery.celery import app
import logging

@app.task
def run_job_on_worker(func, jobset_id, job_id, iteration_id, ctrls, previous_job_ids, input_job_ids):

    logging.info("starting task")

    try: 
        input_job_ids = input_job_ids if input_job_ids is not None else previous_job_ids

        kwargs = {
            "ctrls": ctrls,
            "previous_job_ids": input_job_ids,
            "jobset_id": jobset_id,
            "node_id": job_id,
            "job_id": iteration_id,
        }
        func(**kwargs)
    except:
        logging.error("wtf")

    logging.info("ending task")
