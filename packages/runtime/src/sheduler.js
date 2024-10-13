let isSheduled = false;
const jobs = [];

export function enqueueJob(job) {
	jobs.push(job);
	sheduleUpdate();
}

function sheduleUpdate() {
	if (isSheduled) return;

	isSheduled = true;
	queueMicrotask(processJobs);
}

function processJobs() {
	while (jobs.length > 0) {
		const job = jobs.shift();
		const result = job();

		Promise.resolve(result).then(
			() => {
				// Job completed successfully
			},
			(err) => {
				console.error(`[scheduler]: ${err}`);
			}
		)
	}

	isSheduled = false;
}