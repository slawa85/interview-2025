import { Controller, Post } from '@nestjs/common';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post('run')
  async runPipeline(): Promise<{
    success: boolean;
    message: string;
    results: {
      processed: number;
      extracted: number;
      saved: number;
      errors: number;
    };
  }> {
    return this.pipelineService.runPipeline(true);
  }
}