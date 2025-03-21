import {Request, Response, NextFunction, RequestHandler} from "express";
import fs from "fs";
import path from "path";

export interface LoggerParams {
    logFilePath?: string;
}

function httpLogger(options: LoggerParams = {}): RequestHandler{
    const {logFilePath} = options;
    return (req: Request, _res: Response, next: NextFunction) => {
        const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

        if (logFilePath) {
            const logFileDir = path.dirname(logFilePath);

            // Create log file directory if it doesn't exist
            if (!fs.existsSync(logFileDir)) {
                fs.mkdirSync(logFileDir, {recursive: true});
            }

            // Use `fs.open` in append mode ('a') to create the file if it doesn't exist safely
            fs.open(logFilePath, "a", (err, fd) => {
                if (err) {
                    console.error("Failed to open log file:", err);
                    return;
                }

                // Write log entry
                fs.appendFile(fd, logEntry, (writeErr) => {
                    if (writeErr) {
                        console.error("Failed to write log entry:", writeErr);
                    }

                    // Close file descriptor after writing
                    fs.close(fd, (closeErr) => {
                        if (closeErr) {
                            console.error("Failed to close log file:", closeErr);
                        }
                    });
                });
            });
        } else {
            console.log(logEntry.trim());
        }

        next();
    };
}

export default httpLogger;
