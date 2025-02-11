import cron from 'node-cron';
import { AdjustCronTime, UpdateVisitors } from './cronFunctions';

const visitorcron = AdjustCronTime(14, 2);

// Schedule the task to run every day at 9:00 AM
cron.schedule(visitorcron.expression, UpdateVisitors, {
    scheduled: true
});

console.log(`Cron job scheduled to update vistors daily at ${visitorcron.hour}:${visitorcron.minute} AM UTC`);