<?php

namespace App\Repository;

use App\Entity\BorderFee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

final class BorderFeeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, BorderFee::class); }

    public function queryAll(string $alias = 'entity'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)->orderBy($alias.'.id', 'ASC');
    }
}
