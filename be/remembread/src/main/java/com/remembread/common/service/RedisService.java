package com.remembread.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void setValue(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void setValue(String key, Object value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
    }

    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void addToZSet(String key, Object value, double score) {
        redisTemplate.opsForZSet().add(key, value, score);
    }

    public Set<Object> getZSetRange(String key, long start, long end) {
        return redisTemplate.opsForZSet().range(key, start, end);
    }

    public Set<Object> getZSetReverseRange(String key, long start, long end) {
        return redisTemplate.opsForZSet().reverseRange(key, start, end);
    }

    public Set<Object> getOneZSetReverseRangeByScore(String key, double min, double max) {
        Set<Object> result = redisTemplate.opsForZSet().reverseRangeByScore(key, min, max, 0, 1);
        if (result.isEmpty()) {
            result = redisTemplate.opsForZSet().rangeByScore(key, min, 1, 0, 1);
        }
        return result;
    }

    public void removeFromZSet(String key, Object value) {
        redisTemplate.opsForZSet().remove(key, value);
    }

    public Long getZSetSize(String key) {
        return redisTemplate.opsForZSet().size(key);
    }

    public void putHash(String key, String hashKey, Object value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public void putAllHash(String key, Map<String, Object> hash) {
        redisTemplate.opsForHash().putAll(key, hash);
    }

    public Object getHash(String key, String hashKey) {
        return redisTemplate.opsForHash().get(key, hashKey);
    }

    public Map<Object, Object> getHashMap(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    public void removeHash(String key, Object hashKey) {
        redisTemplate.opsForHash().delete(key, hashKey);
    }

    public void incrementHash(String key, Object hashKey, Long delta) {
        redisTemplate.opsForHash().increment(key, hashKey, delta);
    }

    public void incrementHash(String key, Object hashKey, Double delta) {
        redisTemplate.opsForHash().increment(key, hashKey, delta);
    }

    public void pushList(String key, Object value) {
        redisTemplate.opsForList().rightPush(key, value);
    }

    public List<Object> getList(String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

}
