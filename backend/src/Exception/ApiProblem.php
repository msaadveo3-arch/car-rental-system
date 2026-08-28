<?php

namespace App\Exception;

final class ApiProblem extends \RuntimeException
{
    public function __construct(string $message, public readonly int $status)
    {
        parent::__construct($message);
    }
}
