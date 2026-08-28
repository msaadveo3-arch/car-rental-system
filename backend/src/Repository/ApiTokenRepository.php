<?php

namespace App\Repository;

use App\Entity\ApiToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

final class ApiTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, ApiToken::class); }

    public function queryAll(string $alias = 'entity'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)->orderBy($alias.'.id', 'ASC');
    }

    public function deleteByRawToken(string $token): void
    {
        $this->createQueryBuilder('token')
            ->delete()
            ->where('token.tokenHash = :hash')
            ->setParameter('hash', hash('sha256', $token))
            ->getQuery()
            ->execute();
    }

    public function findValidByRawToken(string $token): ?ApiToken
    {
        return $this->createQueryBuilder('token')
            ->addSelect('user')
            ->innerJoin('token.user', 'user')
            ->where('token.tokenHash = :hash')
            ->andWhere('token.expiresAt > :now')
            ->setParameter('hash', hash('sha256', $token))
            ->setParameter('now', new \DateTime())
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

}
