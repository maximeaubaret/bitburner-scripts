export const JOB_SCRIPTS = {
  HACK: "/scripts/job.hack.js",
  WEAKEN: "/scripts/job.weaken.js",
  GROW: "/scripts/job.grow.js",
};

export const JOB_SCRIPTS_DEPS = ["/lib/utils.js"];

export const FILES_TO_COPY_FOR_REMOTE_JOBS = [
  ...Object.values(JOB_SCRIPTS),
  ...JOB_SCRIPTS_DEPS,
];
