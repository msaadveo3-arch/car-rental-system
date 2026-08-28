<?php

namespace App\EventSubscriber;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

final class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly LoggerInterface $logger) {}

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::EXCEPTION => ['onException', -100]];
    }

    public function onException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $exception = $event->getThrowable();
        $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : Response::HTTP_INTERNAL_SERVER_ERROR;
        $message = $status >= 500 ? 'Internal server error' : ($exception->getMessage() ?: Response::$statusTexts[$status]);

        if ($status >= 500) {
            $this->logger->error('Unhandled API exception: {class}: {message}', [
                'class' => $exception::class,
                'message' => $exception->getMessage(),
                'exception' => $exception,
                'method' => $request->getMethod(),
                'path' => $request->getPathInfo(),
            ]);
        }

        $event->setResponse(new JsonResponse(['success' => false, 'message' => $message], $status));
    }
}
